{
    'name': 'Improved Chatter In Odoo',
    'version': '16.0.1.0.0',
    'category': 'Discuss',
    'depends': ['base', 'mail'],
    'assets': {
        'web.assets_backend': [
            'improved_chatter/static/src/xml/voice_in_odoo.xml',
            'improved_chatter/static/src/js/record_voice_component.js',
            'improved_chatter/static/src/js/voice_in_odoo.js',
            'improved_chatter/static/src/js/record_voice_model.js'
        ]
    },
    'installable': True,
    'auto_install': False,
    'application': False,
}
