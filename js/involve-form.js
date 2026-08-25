(function () {
  const form = document.getElementById('involve-form');
  if (!form) return;

  const thanks = document.getElementById('involve-thanks');
  const SUBMIT_URL = 'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-8e8c4968-55c0-47b4-a2c2-0a18affc3f51/emailer/submit';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const values = {};
    for (const [key, value] of data.entries()) {
      if (key in values) {
        if (Array.isArray(values[key])) {
          values[key].push(value);
        } else {
          values[key] = [values[key], value];
        }
      } else {
        values[key] = value;
      }
    }

    const body = {
      form: values,
      subject: 'New Submission on Membership Card Protocol Site',
    };

    fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function () {
      form.hidden = true;
      if (thanks) thanks.hidden = false;
    });
  });
})();
