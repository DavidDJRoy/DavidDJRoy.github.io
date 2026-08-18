/**
 * David D.J. Roy — site behaviour
 *
 * BOOKING_EMAIL is the public address used by the contact form, mailto links,
 * and JSON-LD.
 */

const BOOKING_EMAIL = 'Daviddjroy@gmail.com';

const TYPE_LABELS = {
  venue: 'Booking a gig / venue',
  casting: 'Casting / audition',
  media: 'Media / press',
  comedian: 'Comedian looking to collaborate',
  other: 'Other',
};

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function syncBookingEmail() {
  const jsonLd = document.getElementById('person-jsonld');
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd.textContent);
      data.email = 'mailto:' + BOOKING_EMAIL;
      jsonLd.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      console.warn('Could not update Person JSON-LD email', err);
    }
  }

  document.querySelectorAll('[data-booking-mailto]').forEach((link) => {
    link.setAttribute('href', 'mailto:' + BOOKING_EMAIL);
    if (link.textContent.trim().includes('@')) {
      link.textContent = BOOKING_EMAIL;
    }
  });
}

function setupCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.querySelector(btn.getAttribute('data-copy'));
      if (!target) {
        return;
      }

      const text = target.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
        const previous = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => {
          btn.textContent = previous;
        }, 1600);
      } catch (err) {
        console.warn('Clipboard copy failed', err);
        btn.textContent = 'Copy failed';
      }
    });
  });
}

function setupPrintKit() {
  const printBtn = document.getElementById('print-kit');
  if (!printBtn) {
    return;
  }

  printBtn.addEventListener('click', () => {
    window.print();
  });
}

function setupMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) {
    return;
  }

  const close = () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
  };

  toggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });
}

function setupBookingForm() {
  const form = document.getElementById('booking-form');
  const status = document.getElementById('form-status');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const type = String(data.get('type') || '').trim();
    const date = String(data.get('date') || '').trim();
    const city = String(data.get('city') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !type || !message) {
      if (status) {
        status.textContent = 'Name, email, inquiry type, and a message are required.';
      }
      return;
    }

    const typeLabel = TYPE_LABELS[type] || type;
    const subject = 'Booking inquiry — ' + typeLabel + ' — ' + name;
    const bodyLines = [
      'Name: ' + name,
      'Email: ' + email,
      'Inquiry type: ' + typeLabel,
      'Date: ' + (date || '(not specified)'),
      'City: ' + (city || '(not specified)'),
      '',
      message,
    ];

    const mailto =
      'mailto:' +
      encodeURIComponent(BOOKING_EMAIL) +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(bodyLines.join('\n'));

    if (status) {
      status.textContent = 'Opening your mail app to ' + BOOKING_EMAIL + '…';
    }

    window.location.href = mailto;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  syncBookingEmail();
  setupMobileNav();
  setupCopyButtons();
  setupPrintKit();
  setupBookingForm();
});
