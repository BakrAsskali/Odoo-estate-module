/** @odoo-module **/
import { registerPatch } from '@mail/model/model_core';
import { many } from '@mail/model/model_field';
import '@mail/models/attachment_card';
import '@mail/models/composer_view';
require('web.core');
var recorder, gumStream;
registerPatch({
    name: 'ComposerView',
    recordMethods: {
        recordVoice: function () {
            /**
             * Asks for access to the user's microphone if not granted yet, then
             * starts recording.
             */
            var self = this;
            if (recorder && recorder.state == "recording") {
                recorder.stop();
                gumStream.getAudioTracks()[0].stop();
                self.updateButtonColor(false);  // Update button color
            } else {
                navigator.mediaDevices.getUserMedia({
                    audio: true
                }).then((stream) => {
                    gumStream = stream;
                    var base64String;
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
                });
            }
        },
        updateButtonColor: function (recording) {
            var button = document.getElementById("record_voice");
            if (recording) {
                button.style.backgroundColor = "#ff0000";
            } else {
                button.style.backgroundColor = "#ffffff";
            }
        },
    },
});
registerPatch({
    name: 'AttachmentCard',
    recordMethods: {
        onRemoveAttachment: function () {
            /**
             * Removes the attachment.
             */
            var delete_button = document.getElementById("voiceChatterMessage");
            if (delete_button) {
                delete_button.remove();
            }
        }
    },
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
