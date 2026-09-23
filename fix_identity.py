import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

widget = '<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>'
if widget not in html:
    html = html.replace('</head>', f'  {widget}\n</head>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
print('Added to index')

with open('admin/index.html', 'r', encoding='utf-8') as f:
    admin = f.read()

admin = admin.replace('https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js', 'https://unpkg.com/decap-cms@^3.1.0/dist/decap-cms.js')
with open('admin/index.html', 'w', encoding='utf-8') as f:
    f.write(admin)
print('Updated admin')
