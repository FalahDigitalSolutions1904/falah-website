import re

with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<form id="contactForm">', '<form id="contactForm" name="contact" data-netlify="true">\n            <input type="hidden" name="form-name" value="contact">')
html = html.replace('type="text" class="form-ctrl"', 'type="text" name="name" class="form-ctrl"')
html = html.replace('type="email" class="form-ctrl"', 'type="email" name="email" class="form-ctrl"')
html = html.replace('type="tel" class="form-ctrl"', 'type="tel" name="phone" class="form-ctrl"')
html = html.replace('<select class="form-ctrl" required>', '<select name="service" class="form-ctrl" required>')
html = html.replace('<textarea class="form-ctrl"', '<textarea name="message" class="form-ctrl"')

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_block = '''const formData = new FormData(cForm);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    }).then(() => {
      cForm.style.display = "none";
      const succ = document.getElementById("formSuccess");
      if (succ) succ.classList.add("show");
    }).catch(e => {
      btn.textContent = origText;
      btn.disabled = false;
    });'''

js = re.sub(r'setTimeout\(\(\) => \{.*?\}, 1400\);', new_block, js, flags=re.DOTALL)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
