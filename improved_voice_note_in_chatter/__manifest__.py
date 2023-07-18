# -*- coding: utf-8 -*-
################################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2023-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
#    Author: Athira P S (odoo@cybrosys.com)
#
#    You can modify it under the terms of the GNU AFFERO
#    GENERAL PUBLIC LICENSE (AGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU AFFERO GENERAL PUBLIC LICENSE (AGPL v3) for more details.
#
#    You should have received a copy of the GNU AFFERO GENERAL PUBLIC LICENSE
#    (AGPL v3) along with this program.
#
##################################################################################
{
    'name': 'Improved Voice Chat In Odoo',
    'version': '16.0.1.0.0',
    'category': 'Discuss',
    'depends': ['base', 'mail'],
    'assets': {
        'web.assets_backend': [
            'improved_voice_note_in_chatter/static/src/xml/voice_in_odoo.xml',
            'improved_voice_note_in_chatter/static/src/js/record_voice_component.js',
            'improved_voice_note_in_chatter/static/src/js/voice_in_odoo.js',
            'improved_voice_note_in_chatter/static/src/js/record_voice_model.js'
        ]
    },
    'installable': True,
    'auto_install': False,
    'application': False,
}
