// Cashier Portal Logic

// Mock Data
let students = [
    { id: 'S001', firstName: 'Alisher', lastName: 'Qodirov', class: '8-A', paymentStatus: 'Paid', lastPaidMonth: 'March' },
    { id: 'S002', firstName: 'Madina', lastName: 'Karimova', class: '9-B', paymentStatus: 'Pending', lastPaidMonth: 'February' },
    { id: 'S003', firstName: 'Sardor', lastName: 'Toshmatov', class: '10-A', paymentStatus: 'Unpaid', lastPaidMonth: 'January' },
    { id: 'S004', firstName: 'Jasur', lastName: 'Mominov', class: '8-A', paymentStatus: 'Paid', lastPaidMonth: 'March' },
];

let transactionHistory = [
    { id: 'TX1001', studentId: 'S001', studentName: 'Alisher Qodirov', class: '8-A', amount: '2,000,000 UZS', month: 'March', date: '2026-03-01' },
    { id: 'TX1002', studentId: 'S004', studentName: 'Jasur Mominov', class: '8-A', amount: '2,000,000 UZS', month: 'March', date: '2026-03-05' }
];

let selectedStudentForPayment = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderPaymentsList();
    renderTransactionsList();
    updateClassFilter();
});

// Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.getAttribute('href') && item.getAttribute('href').includes('index.html')) return;
            e.preventDefault();

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetSection = item.getAttribute('data-section');
            if(targetSection) {
                sections.forEach(sec => sec.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
            }
        });
    });
}

function updateClassFilter() {
    const select = document.getElementById('classFilter');
    if(!select) return;

    // Get unique classes
    const classes = [...new Set(students.map(s => s.class))].sort();
    let options = '<option value="all">All Classes</option>';
    classes.forEach(c => {
        options += `<option value="${c}">${c}</option>`;
    });
    select.innerHTML = options;
}

function renderPaymentsList() {
    const tbody = document.getElementById('paymentTableBody');
    if (!tbody) return;

    const searchQuery = (document.getElementById('studentSearchInput') ? document.getElementById('studentSearchInput').value.toLowerCase() : '');
    const classFilter = (document.getElementById('classFilter') ? document.getElementById('classFilter').value : 'all');

    tbody.innerHTML = '';

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.firstName.toLowerCase().includes(searchQuery) ||
            s.lastName.toLowerCase().includes(searchQuery) ||
            s.id.toLowerCase().includes(searchQuery);
        const matchesClass = classFilter === 'all' || s.class === classFilter;
        return matchesSearch && matchesClass;
    });

    filteredStudents.forEach(student => {
        let badgeClass = 'badge-warning';
        if(student.paymentStatus === 'Paid') badgeClass = 'badge-success';
        if(student.paymentStatus === 'Unpaid') badgeClass = 'badge-danger';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.class}</td>
            <td>${student.lastPaidMonth}</td>
            <td><span class="badge ${badgeClass}">${student.paymentStatus}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem; color: #10b981; border-color: rgba(16,185,129,0.3);" onclick="selectForPayment('${student.id}')">Process Payment</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterPayments() {
    renderPaymentsList();
}

function selectForPayment(studentId) {
    const student = students.find(s => s.id === studentId);
    if(student) {
        selectedStudentForPayment = student;
        document.getElementById('selectedStudentName').innerText = `${student.firstName} ${student.lastName} (${student.id})`;
        document.getElementById('selectedStudentClass').innerText = `Class: ${student.class}`;

        // Auto select next month based on lastPaidMonth (simplify for MVP)
        document.getElementById('paymentAmount').value = '2,000,000'; // Default

        // Switch to the process tab visually
        const processSec = document.getElementById('process-payment');
        if(processSec) {
            // programmatic tab switch
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-section="process-payment"]').classList.add('active');

            document.querySelectorAll('.section-content').forEach(sec => sec.classList.remove('active'));
            processSec.classList.add('active');
        }
    }
}

function submitPayment() {
    if(!selectedStudentForPayment) {
        alert("Please select a student from the Student Payments list first.");
        return;
    }

    const month = document.getElementById('paymentMonth').value;
    const method = document.getElementById('paymentMethod').value;

    if(!month || !method) {
        alert("Please select a month and payment method.");
        return;
    }

    // Process
    alert(`Payment of 2,000,000 UZS successfully processed for ${selectedStudentForPayment.firstName} for ${month} via ${method}.`);

    // Update data
    selectedStudentForPayment.paymentStatus = 'Paid';
    selectedStudentForPayment.lastPaidMonth = month;

    // Add to history
    transactionHistory.push({
        id: 'TX' + Math.floor(Math.random() * 9000 + 1000),
        studentId: selectedStudentForPayment.id,
        studentName: `${selectedStudentForPayment.firstName} ${selectedStudentForPayment.lastName}`,
        class: selectedStudentForPayment.class,
        amount: '2,000,000 UZS',
        month: month,
        date: new Date().toISOString().split('T')[0]
    });

    // Reset selection
    selectedStudentForPayment = null;
    document.getElementById('selectedStudentName').innerText = 'No student selected';
    document.getElementById('selectedStudentClass').innerText = 'Please select a student from the list first';

    renderPaymentsList();
    renderTransactionsList();

    // Go back to main payments page
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="student-payments"]').classList.add('active');

    document.querySelectorAll('.section-content').forEach(sec => sec.classList.remove('active'));
    document.getElementById('student-payments').classList.add('active');
}

function renderTransactionsList() {
    const tbody = document.getElementById('transactionTableBody');
    if(!tbody) return;

    tbody.innerHTML = '';

    // Show newest first
    [...transactionHistory].reverse().forEach(tx => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${tx.id}</td>
            <td>${tx.date}</td>
            <td>${tx.studentName}</td>
            <td>${tx.class}</td>
            <td>${tx.month}</td>
            <td style="font-weight: bold; color: #10b981;">${tx.amount}</td>
        `;
        tbody.appendChild(tr);
    });
}
