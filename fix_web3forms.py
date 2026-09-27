import re

# Update contact.html
with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the Netlify form tag with Web3Forms hidden inputs
old_form = '<form id="contactForm" name="contact" data-netlify="true">\n            <input type="hidden" name="form-name" value="contact">'
new_form = '''<form id="contactForm">
            <input type="hidden" name="access_key" value="0943e37a-75bb-455a-b346-0fe6d4ca887b">
            <input type="hidden" name="subject" value="New Contact Form Submission">'''

html = html.replace(old_form, new_form)

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Update js/main.js
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the fetch block
old_fetch = '''const formData = new FormData(cForm);
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

new_fetch = '''const formData = new FormData(cForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: json
    })
    .then(async (response) => {
      let result = await response.json();
      if (response.status == 200) {
        cForm.style.display = "none";
        const succ = document.getElementById("formSuccess");
        if (succ) succ.classList.add("show");
      } else {
        console.log(result);
        alert(result.message || "Something went wrong!");
        btn.textContent = origText;
        btn.disabled = false;
      }
    })
    .catch(error => {
      console.log(error);
      alert("Something went wrong!");
      btn.textContent = origText;
      btn.disabled = false;
    });'''

js = js.replace(old_fetch, new_fetch)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
