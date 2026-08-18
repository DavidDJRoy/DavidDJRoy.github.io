/**
 * David D.J. Roy — site behaviour
 *
 * BOOKING_EMAIL is the public address used by the contact form, mailto links,
 * and JSON-LD.
 */

const BOOKING_EMAIL = 'Daviddjroy@gmail.com';

const TYPE_LABELS = {
  venue: 'Venue / booker',
  comedian: 'Comedian looking to collaborate',
  media: 'Media / press',
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
  if (!jsonLd) {
    return;
  }

  try {
    const data = JSON.parse(jsonLd.textContent);
    data.email = 'mailto:' + BOOKING_EMAIL;
    jsonLd.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.warn('Could not update Person JSON-LD email', err);
  }
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
  setupBookingForm();
});
