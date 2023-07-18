/** @odoo-module **/
import { registerPatch } from '@mail/model/model_core';
import { attr, many, one } from '@mail/model/model_field';
import { clear } from '@mail/model/model_field_command';
import '@mail/models/composer_view';
import Dialog from "web.Dialog";
const { _t } = require('web.core');
var flag = false;
var recorder, gumStream;
registerPatch({
    name: 'ComposerView',
    recordMethods: {
        recordVoice: function () {
            //Check security of site
            if (location.href.includes('https:')) {
                /**
                 * Asks for access to the user's microphone if not granted yet, then
                 * starts recording.
                 */
                var self = this;
                if (recorder && recorder.state == "recording") {
                    recorder.stop();
                    gumStream.getAudioTracks()[0].stop();
                    this.updateButtonColor(false);  // Update button color
                    notification.notify({
                        title: _t("Recording Stopped"),
                        message: _t("The recording has been stopped."),
                        type: "info",
                    });
                } else {
                    navigator.mediaDevices.getUserMedia({
                        audio: true
                    }).then((stream) => {
                        gumStream = stream;
                        var base64String
                        recorder = new MediaRecorder(stream);
                        recorder.ondataavailable = async function (e) {
                            var reader = new FileReader();
                            reader.readAsDataURL(e.data);
                            reader.onloadend = async function () {
                                base64String = reader.result;
                                var data = base64String;
                                var fl = [];
                                var arr = data.split(','),
                                    mime = arr[0].match(/:(.*?);/)[1],
                                    bstr = atob(arr[1]),
                                    n = bstr.length,
                                    u8arr = new Uint8Array(n);

                                while (n--) {
                                    u8arr[n] = bstr.charCodeAt(n);
                                }

                                var f = new File([u8arr], 'message.mp3', {
                                    type: mime
                                });
                                fl.push(f);
                                await self.fileUploader.uploadFiles(fl)
                            };
                        };
                        recorder.start();
                        self.updateButtonColor(true);  // Update button color
                        notification.notify({
                            title: _t("Recording Started"),
                            message: _t("The recording has started."),
                            type: "success",
                        });
                    });
                }

            } else {
                //If the site is not https,an alert will display.
                if (flag == false) {
                    flag = true
                    var dialog = new Dialog(this, {
                        size: 'medium',
                        buttons: '',
                        $content: $('<div>', {
                            text: _t("Site is not secure,use secured site(https)")
                        }),
                    }).open()
                }
            }
        },
        updateButtonColor: function (recording) {
            var $button = this.$('.o_composer_button_record');
            if (recording) {
                $button.addClass('recording');  // Add the 'recording' class to button element
            } else {
                $button.removeClass('recording');  // Remove the 'recording' class from button element
            }
        },
    }
});
registerPatch({
    name: 'AttachmentList',
    fields: {
        /**
         * States the attachment audio that are displaying this audioAttachments.
         */
        attachmentAudio: many('AttachmentAudio', {
            compute() {
                return this.nonImageAttachments.map(attachment => ({ attachment }));
            },
            inverse: 'attachmentList',
        }),
    }
});