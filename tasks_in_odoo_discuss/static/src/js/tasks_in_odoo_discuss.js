/** @odoo-module **/
import { addLink, escapeAndCompactTextContent, parseAndTransform } from '@mail/js/utils';
import { registerPatch } from '@mail/model/model_core';
import { attr, one } from '@mail/model/model_field';
import { clear } from '@mail/model/model_field_command';
import '@mail/models/composer_view';
import '@mail/models/message';
import '@mail/models/message_action_list';
require('web.core');

registerPatch({
    name: 'ComposerView',
    recordMethods: {
        _generateMessageBody(flag = false, task = null) {
            if (flag) {
                var body = task;
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
            var popup = document.getElementById("popup");
            const self = this;
            if (!popup) {
                // create popup
                var popup = document.createElement("div");
                popup.id = "popup";
                popup.style.position = "fixed";
                popup.style.top = "50%";
                popup.style.left = "50%";
                popup.style.transform = "translate(-50%, -50%)";
                popup.style.backgroundColor = "#ffffff";
                popup.style.borderRadius = "10px";
                popup.style.boxShadow = "0 0 10px 0 rgba(0, 0, 0, 0.2)";
                popup.style.zIndex = "9999";
                popup.style.width = "400px";
                popup.style.height = "600px";


                // create popup content
                var popup_content = document.createElement("div");
                popup_content.id = "popup_content";
                popup_content.style.padding = "10px";

                // create popup title
                var popup_title = document.createElement("div");
                popup_title.id = "popup_title";
                popup_title.style.textAlign = "center";
                popup_title.style.fontSize = "20px";
                popup_title.style.fontWeight = "bold";
                popup_title.style.padding = "10px";
                popup_title.innerHTML = "Task";

                //create task title
                var task_title = document.createElement("div");
                task_title.id = "task_title";
                task_title.style.textAlign = "center";
                task_title.style.fontSize = "15px";
                task_title.style.padding = "10px";
                task_title.innerHTML = "Please enter your task title";

                // create task input
                var task_input = document.createElement("input");
                task_input.id = "task_input";
                task_input.style.width = "100%";
                task_input.style.padding = "10px";
                task_input.style.borderRadius = "10px";
                task_input.style.border = "1px solid #000000";

                //create person
                var person = document.createElement("div");
                person.id = "person";
                person.style.textAlign = "center";
                person.style.fontSize = "15px";
                person.style.padding = "10px";
                person.innerHTML = "Please enter the person you want to assign the task to";

                var div = document.createElement("div");
                div.className = "o_ComposerTextInput"

                var suggestionList = document.createElement("div");
                suggestionList.className = "o_ComposerTextInput_suggestionList";
                if (self.composerSuggestionListView) {
                    suggestionList.innerHTML
                }
                div.appendChild(suggestionList);

                // create person input
                var person_input = document.createElement("input");
                person_input.className = "o_input";
                person_input.id = "person_input";
                person_input.style.width = "100%";
                person_input.style.padding = "10px";
                person_input.style.borderRadius = "10px";
                person_input.style.border = "1px solid #000000";
                person_input.addEventListener("keyup", function (event) {
                    self.onKeyupTextarea(event);
                });
                person_input.addEventListener("keydown", function (event) {
                    self.onKeydownTextarea(event);
                });
                person_input.addEventListener("focusin", function (event) {
                    self.onFocusinTextarea(event);
                });
                person_input.addEventListener("focusout", function (event) {
                    self.onFocusoutTextarea(event);
                });
                person_input.addEventListener("click", function (event) {
                    self.onClickTextarea(event);
                });
                person_input.addEventListener("input", function (event) {
                    self.onInputTextarea(event);
                });
                div.appendChild(person_input);

                // create popup description
                var popup_description = document.createElement("div");
                popup_description.id = "popup_description";
                popup_description.style.textAlign = "center";
                popup_description.style.fontSize = "15px";
                popup_description.style.padding = "10px";
                popup_description.innerHTML = "Please describe your task";

                // create popup input
                var popup_input = document.createElement("textarea");
                popup_input.id = "popup_input";
                popup_input.style.width = "100%";
                popup_input.style.padding = "10px";
                popup_input.style.borderRadius = "10px";
                popup_input.style.border = "1px solid #000000";
                popup_input.style.height = "200px";

                // create popup button
                var popup_button = document.createElement("button");
                popup_button.id = "popup_button";
                popup_button.style.width = "100%";
                popup_button.style.padding = "10px";
                popup_button.style.borderRadius = "10px";
                popup_button.style.border = "1px solid #000000";
                popup_button.style.backgroundColor = "#ffffff";
                popup_button.innerHTML = "Submit";
                popup_button.onclick = function () {
                    var input = document.getElementById("popup_input");
                    var title = document.getElementById("task_input");
                    var person = document.getElementById("person_input");
                    if (title.value != "" && person.value != "" && input.value != "") {
                        popup.style.display = "none";
                        var message = title.value + '<br>' +
                            "Person: " + person.value + '<br>' +
                            "Task: " + input.value;
                        var flag = true;
                        self.postMessage(flag, message);
                    }
                    task_input.value = "";
                    person_input.value = "";
                    input.value = "";
                };

                //close popup button    
                var close_button = document.createElement("button");
                close_button.id = "close_button";
                close_button.style.position = "absolute";
                close_button.style.top = "0";
                close_button.style.right = "0";
                close_button.style.padding = "10px";
                close_button.style.borderRadius = "10px";
                close_button.style.backgroundColor = "#ffffff";
                close_button.onclick = function () {
                    popup.style.display = "none";
                };

                var close_button_icon = document.createElement("i");
                close_button_icon.id = "close_button_icon";
                close_button_icon.className = "fa fa-times";
                close_button_icon.style.fontSize = "20px";
                close_button_icon.style.color = "#000000";

                // append all elements
                close_button.appendChild(close_button_icon);
                popup_content.appendChild(popup_title);
                popup_content.appendChild(task_title);
                popup_content.appendChild(task_input);
                popup_content.appendChild(person);
                popup_content.appendChild(div);
                popup_content.appendChild(popup_description);
                popup_content.appendChild(popup_input);
                popup_content.appendChild(popup_button);
                popup_content.appendChild(close_button);
                popup.appendChild(popup_content);
                var div = document.getElementsByClassName("o_Discuss_content");
                div[0].appendChild(popup);

            } else {
                //toggle popup
                if (popup.style.display == "none") {
                    popup.style.display = "block";
                } else {
                    popup.style.display = "none";
                }
            }
        },
        async postMessage(flag = false, task = null) {
            const composer = this.composer;
            const postData = this._getMessageData(flag, task);
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
        _getMessageData(flag = false, task = null) {
            return {
                attachment_ids: this.composer.attachments.map(attachment => attachment.id),
                attachment_tokens: this.composer.attachments.map(attachment => attachment.accessToken),
                body: this._generateMessageBody(flag, task),
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
                return this.body.includes('Task: ');
            }
        }),
        isDone: attr({
            async compute() {
                var done = await this.messaging.rpc({
                    model: 'mail.message',
                    method: 'isDoneMethod',
                });
                this.update({ isDone: done });
            },
        }),
    },
});

registerPatch({
    name: 'MessageActionList',
    recordMethods: {
        async _onClickDone() {
            await this.messaging.rpc({
                model: 'mail.message',
                method: 'doneMethod',
            });
            await this.messaging.rpc({
                model: 'mail.message',
                method: 'isDoneMethod',
            });
            this.message.update({ isDone: !this.message.isDone });
        },
    },
});