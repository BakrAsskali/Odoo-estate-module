/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Counter } from "./counter/counter";
import { todo } from "./todo/todo";

export class Playground extends Component {
    static template = "owl_playground.playground";
    static components = { Counter, todo };
    setup() {
        this.todo = { id: 3, text: "buy milk", done: false };
    }
}

