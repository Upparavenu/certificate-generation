import { auth, db } from './firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Registration Logic ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => window.location.href = 'dashboard.html')
            .catch(err => alert(err.message));
    });
}

// --- Login Logic ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => window.location.href = 'dashboard.html')
            .catch(err => alert(err.message));
    });
}

// --- Auth State Observer ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        if (document.getElementById('userNameDisplay')) {
            document.getElementById('userNameDisplay').innerText = user.email.split('@')[0];
        }
        loadUserStats(user.email);
        loadUserCertificates(user.email);
    } else {
        // Not logged in, redirect if on protected page
        const protectedPaths = ['dashboard.html', 'generate.html', 'certificates.html', 'admin.html'];
        if (protectedPaths.some(path => window.location.pathname.includes(path))) {
            window.location.href = 'login.html';
        }
    }
});

// --- Logout ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = 'index.html');
    });
}

// --- Load Data into Dashboard ---
async function loadUserStats(email) {
    const totalCountEl = document.getElementById('totalCount');
    if (!totalCountEl) return;

    const q = query(collection(db, "certificates"), where("email", "==", email));
    const snapshot = await getDocs(q);
    totalCountEl.innerText = snapshot.size;
}

// --- Load Data into Certificates Table ---
async function loadUserCertificates(email) {
    const tableBody = document.getElementById('certificateTableBody');
    if (!tableBody) return;

    const q = query(collection(db, "certificates"), where("email", "==", email));
    const snapshot = await getDocs(q);
    
    tableBody.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        tableBody.innerHTML += `
            <tr style="border-bottom: 1px solid var(--glass-border);">
                <td style="padding: 1rem;">${data.studentName}</td>
                <td style="padding: 1rem;">${data.course}</td>
                <td style="padding: 1rem;">${data.certificateId}</td>
                <td style="padding: 1rem;">
                    <button class="btn btn-primary" onclick="window.location.href='verify.html?id=${data.certificateId}'">View</button>
                </td>
            </tr>
        `;
    });
}
