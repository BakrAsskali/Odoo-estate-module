/** @odoo-module **/
import { addLink, escapeAndCompactTextContent, parseAndTransform } from '@mail/js/utils';
import { registerPatch } from '@mail/model/model_core';
import { attr } from '@mail/model/model_field';
import { clear, link } from '@mail/model/model_field_command';
import '@mail/models/composer_view';
import '@mail/models/message';
import '@mail/models/message_action';
import '@mail/models/message_action_list';
require('web.core');

registerPatch({
    name: 'ComposerView',
    recordMethods: {
        _generateMessageBody(flag = false) {
            if (flag) {
                var body = 'this is a task';
                return body;
            } else {
                const escapedAndCompactContent = escapeAndCompactTextContent(this.composer.textInputContent);
                let body = escapedAndCompactContent.replace(/&nbsp;/g, ' ').trim();
                body = this._generateMentionsLinks(body);
                body = parseAndTransform(body, addLink);
                body = this._generateEmojisOnHtml(body);
                return body;
            }
        },
        giveTask: async function () {
            var flag = true;
            this.postMessage(flag);

            flag = false;
        },
        async postMessage(flag = false) {
            const composer = this.composer;
            const postData = this._getMessageData(flag);
            const params = {
                'post_data': postData,
                'thread_id': composer.thread.id,
                'thread_model': composer.thread.model,
            };
            try {
                composer.update({ isPostingMessage: true });
                if (composer.thread.model === 'mail.channel') {
                    Object.assign(postData, {
                        subtype_xmlid: 'mail.mt_comment',
                    });
                } else {
                    Object.assign(postData, {
                        subtype_xmlid: composer.isLog ? 'mail.mt_note' : 'mail.mt_comment',
                    });
                    if (!composer.isLog) {
                        params.context = { mail_post_autofollow: this.composer.activeThread.hasWriteAccess };
                    }
                }
                if (this.threadView && this.threadView.replyingToMessageView && this.threadView.thread !== this.messaging.inbox.thread) {
                    postData.parent_id = this.threadView.replyingToMessageView.message.id;
                }
                const { threadView = {} } = this;
                const chatter = this.chatter;
                const { thread: chatterThread } = this.chatter || {};
                const { thread: threadViewThread } = threadView;
                // Keep a reference to messaging: composer could be
                // unmounted while awaiting the prc promise. In this
                // case, this would be undefined.
                const messaging = this.messaging;
                const messageData = await this.messaging.rpc({ route: `/mail/message/post`, params });
                if (!messaging.exists()) {
                    return;
                }
                const message = messaging.models['Message'].insert(
                    messaging.models['Message'].convertData(messageData)
                );
                if (messaging.hasLinkPreviewFeature && !message.isBodyEmpty) {
                    messaging.rpc({
                        route: `/mail/link_preview`,
                        params: {
                            message_id: message.id
                        }
                    }, { shadow: true });
                }
                for (const threadView of message.originThread.threadViews) {
                    // Reset auto scroll to be able to see the newly posted message.
                    threadView.update({ hasAutoScrollOnMessageReceived: true });
                    threadView.addComponentHint('message-posted', { message });
                }
                if (chatter && chatter.exists() && chatter.hasParentReloadOnMessagePosted && messageData.recipients.length) {
                    chatter.reloadParentView();
                }
                if (chatterThread) {
                    if (this.exists()) {
                        this.delete();
                    }
                    if (chatterThread.exists()) {
                        // Load new messages to fetch potential new messages from other users (useful due to lack of auto-sync in chatter).
                        chatterThread.fetchData(['followers', 'messages', 'suggestedRecipients']);
                    }
                }
                if (threadViewThread) {
                    if (threadViewThread === messaging.inbox.thread) {
                        messaging.notify({
                            message: sprintf(messaging.env._t(`Message posted on "%s"`), message.originThread.displayName),
                            type: 'info',
                        });
                        if (this.exists()) {
                            this.delete();
                        }
                    }
                    if (threadView && threadView.exists()) {
                        threadView.update({ replyingToMessageView: clear() });
                    }
                }
                if (composer.exists()) {
                    composer._reset();
                }
            } finally {
                if (composer.exists()) {
                    composer.update({ isPostingMessage: false });
                }
            }
        },
        _getMessageData(flag = false) {
            return {
                attachment_ids: this.composer.attachments.map(attachment => attachment.id),
                attachment_tokens: this.composer.attachments.map(attachment => attachment.accessToken),
                body: this._generateMessageBody(flag),
                message_type: 'comment',
                partner_ids: this.composer.recipients.map(partner => partner.id),
            };
        },
    },
});

registerPatch({
    name: 'Message',
    fields: {
        task: attr({
            compute() {
                return this.body.includes('this is a task');
            }
        }),
    },
});
