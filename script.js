// ===== Student Enrollment System - script.js =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('enrollForm');
    const successMsg = document.getElementById('successMessage');
    const resultsWrap = document.getElementById('resultsWrap');
    const resultsBody = document.getElementById('resultsBody');

    // ---------- Validation rules (return an error message, or '' if valid) ----------
    const namePattern = /^[A-Za-z\s.'-]+$/;

    const rules = {
        sID: (v) => {
            if (!v) return 'Student ID is required.';
            if (v.length < 5) return 'Student ID must be at least 5 characters.';
            if (!/^[A-Za-z0-9-]+$/.test(v)) return 'Student ID can only contain letters, numbers and dashes.';
            return '';
        },
        prefix: (v) => (v && v.length < 2 ? 'Prefix must be at least 2 characters.' : ''),
        firstName: (v) => {
            if (!v) return 'First name is required.';
            if (v.length < 3) return 'First name must be at least 3 characters.';
            if (!namePattern.test(v)) return 'First name can only contain letters.';
            return '';
        },
        middleName: (v) => {
            if (!v) return 'Middle name is required.';
            if (v.length < 2) return 'Middle name must be at least 2 characters.';
            if (!namePattern.test(v)) return 'Middle name can only contain letters.';
            return '';
        },
        lastName: (v) => {
            if (!v) return 'Last name is required.';
            if (v.length < 2) return 'Last name must be at least 2 characters.';
            if (!namePattern.test(v)) return 'Last name can only contain letters.';
            return '';
        },
        suffix: (v) => (v && v.length < 2 ? 'Suffix must be at least 2 characters.' : ''),
        email: (v) => {
            if (!v) return 'Email is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
            return '';
        },
        course: (v) => (!v ? 'Please select a course.' : ''),
        yearLevel: (v) => (!v ? 'Please select a year level.' : '')
    };

    // ---------- Error helpers ----------
    function showError(field, message) {
        const group = field.closest('.form-group');
        let err = group.querySelector('.error-message');
        if (!err) {
            err = document.createElement('span');
            err.className = 'error-message';
            group.appendChild(err);
        }
        err.textContent = message;
        field.classList.add('invalid');
    }

    function clearError(field) {
        const err = field.closest('.form-group').querySelector('.error-message');
        if (err) err.remove();
        field.classList.remove('invalid');
    }

    function validateField(field) {
        const message = rules[field.id](field.value.trim());
        if (message) {
            showError(field, message);
            return false;
        }
        clearError(field);
        return true;
    }

    // ---------- Clear errors while typing ----------
    Object.keys(rules).forEach((id) => {
        const field = document.getElementById(id);
        const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
        field.addEventListener(eventName, () => {
            clearError(field);
            successMsg.hidden = true;
        });
    });

    // ---------- Add a row to the table ----------
    function addRow(values) {
        const row = document.createElement('tr');
        values.forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        resultsBody.appendChild(row);
    }

    // ---------- Submit ----------
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        successMsg.hidden = true;

        let isValid = true;
        Object.keys(rules).forEach((id) => {
            if (!validateField(document.getElementById(id))) isValid = false;
        });

        if (!isValid) {
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const get = (id) => document.getElementById(id).value.trim();

        const courseSelect = document.getElementById('course');
        const option = courseSelect.options[courseSelect.selectedIndex];
        const parent = option.parentElement;
        const courseText = parent.tagName === 'OPTGROUP'
            ? parent.label + ' - ' + option.text
            : option.text;

        const fullName = [get('prefix'), get('firstName'), get('middleName'), get('lastName'), get('suffix')]
            .filter(Boolean)
            .join(' ');

        addRow([get('sID'), fullName, get('email'), courseText, get('yearLevel')]);

        successMsg.textContent = 'Success! ' + get('firstName') + ' ' + get('lastName') + ' has been enrolled.';
        successMsg.hidden = false;
        resultsWrap.hidden = false;

        form.reset();
    });
});
