# -*- coding: utf-8 -*-

from odoo import fields, models, api


class ResUsers(models.Model):

    # ---------------------------------------- Private Attributes ---------------------------------

    _inherit = "res.users"

    # --------------------------------------- Fields Declaration ----------------------------------

    property_ids = fields.One2many(
        "estate.property", "user_id", string="Properties", domain=[("state", "in", ["new", "offer_received"])]
    )