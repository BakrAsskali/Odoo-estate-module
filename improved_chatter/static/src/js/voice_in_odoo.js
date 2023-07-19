/** @odoo-module **/
import { registerPatch } from '@mail/model/model_core';
import { many } from '@mail/model/model_field';
import '@mail/models/attachment_card';
import '@mail/models/composer_view';
const { _t } = require('web.core');
var flag = false;
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
        giveTask: function () {

            var self = this;
            var popup = document.getElementById("popup");

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

                // create person input
                var person_input = document.createElement("input");
                person_input.id = "person_input";
                person_input.style.width = "100%";
                person_input.style.padding = "10px";
                person_input.style.borderRadius = "10px";
                person_input.style.border = "1px solid #000000";

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
                    var textArea = document.getElementsByTagName("textarea")[0];
                    if (title.value != "" && person.value != "" && input.value != "") {
                        popup.style.display = "none";
                        var message = "Task: " + input.value;
                        textArea.value = "To: " + "\n" + "Task: " + title.value + "\n" + "Description: " + message;
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
                popup_content.appendChild(person_input);
                popup_content.appendChild(popup_description);
                popup_content.appendChild(popup_input);
                popup_content.appendChild(popup_button);
                popup_content.appendChild(close_button);
                popup.appendChild(popup_content);
                document.body.appendChild(popup);

            } else {
                //toggle popup
                if (popup.style.display == "none") {
                    popup.style.display = "block";
                } else {
                    popup.style.display = "none";
                }
            }

        }
    }
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
