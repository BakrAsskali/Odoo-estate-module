# -*- coding: utf-8 -*-

from odoo import models, fields, api

class Message(models.Model):
    _inherit = 'mail.message'

    isDone = fields.Boolean(string="Done", default=False)

    @api.model
    def doneMethod(self):
        self.isDone = not self.isDone
        self.write({'isDone': self.isDone})

    @api.model
    def isDoneMethod(self):
        return self.isDone