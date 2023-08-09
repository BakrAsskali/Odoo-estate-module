# -*- coding: utf-8 -*-

from odoo import models, fields, api

class Message(models.Model):
    _inherit = 'mail.message'

    isDone = fields.Boolean(string="Done", default=False, store=True)

    @api.model
    def isDoneMethod(self):
        return self.isDone

    @api.model
    def doneMethod(self):
        self.isDone = not self.isDone
        

    @api.model
    def create(self, vals):
        if 'isDone' not in vals:
            vals['isDone'] = False
        return super(Message, self).create(vals)

    @api.multi
    def write(self, vals):
        if 'isDone' not in vals:
            vals['isDone'] = False
        return super(Message, self).write(vals)
        
