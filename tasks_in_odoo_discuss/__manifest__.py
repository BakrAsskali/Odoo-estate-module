{
    'name': 'Tasks In Odoo Discuss',
    'version': '16.0.1.0.0',
    'category': 'Discuss',
    'depends': ['base', 'mail'],
    'assets': {
        'web.assets_backend': [
            'tasks_in_odoo_discuss/static/src/xml/tasks_in_discuss.xml',
            'tasks_in_odoo_discuss/static/src/js/tasks_in_odoo_discuss.js',
        ]
    },
    'installable': True,
    'auto_install': False,
    'application': False,
}
