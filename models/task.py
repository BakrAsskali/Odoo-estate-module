# res_partner.py

from odoo import models, api


class ResPartner(models.Model):
    _inherit = 'res.partner'

    @api.model
    def slash_command_custom(self, command):
        # Define the logic for your custom command here
        # The 'command' parameter will contain the text after the slash command

        # Example: Sending a response message back to the user
        return {
            'response_type': 'in_channel',
            'text': 'You executed a custom slash command: {}'.format(command),
        }
