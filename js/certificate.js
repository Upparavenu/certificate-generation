import { db, auth } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const certForm = document.getElementById('certificateForm');

if(certForm) {
    certForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const certData = {
            certificateId: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            studentName: document.getElementById('studentName').value,
            course: document.getElementById('course').value,
            rollNumber: document.getElementById('rollNumber').value,
            issueDate: document.getElementById('issueDate').value,
            email: auth.currentUser.email,
            timestamp: serverTimestamp()
        };

        try {
            // 1. Generate QR Code
            const qrDiv = document.getElementById("qrcode");
            qrDiv.innerHTML = "";
            const qrText = `Verify at: https://yourdomain.com/verify.html?id=${certData.certificateId}`;
            new QRCode(qrDiv, qrText);

            // 2. Save to Firestore
            await addDoc(collection(db, "certificates"), certData);
            
            // 3. Show Preview
            showPreview(certData);
            alert("Certificate Generated and Stored!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    });
}

function showPreview(data) {
    const preview = document.getElementById('certificate-preview');
    const qrImage = document.querySelector('#qrcode img').src;
    
    document.getElementById('previewContainer').style.display = 'block';
    preview.innerHTML = `
        <div style="text-align:center">
            <h1>CERTIFICATE OF COMPLETION</h1>
            <p>This is to certify that</p>
            <h2 style="color:#6366f1">${data.studentName}</h2>
            <p>has successfully completed the course</p>
            <h3>${data.course}</h3>
            <p>Issued on ${data.issueDate}</p>
            <div style="margin-top:20px">
                <img src="${qrImage}" style="width:100px">
                <p>ID: ${data.certificateId}</p>
            </div>
        </div>
    `;
}

// PDF Generation Function
window.downloadPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    const name = document.getElementById('studentName').value;
    const course = document.getElementById('course').value;
    const certId = "ID: " + Math.random().toString(36).substr(2, 9).toUpperCase();
    const qrImage = document.querySelector('#qrcode img').src;

    // Design the PDF
    doc.rect(10, 10, 277, 190); // Border
    doc.setFontSize(40);
    doc.text("CERTIFICATE", 148, 50, {align: 'center'});
    doc.setFontSize(20);
    doc.text("OF APPRECIATION", 148, 65, {align: 'center'});
    doc.setFontSize(16);
    doc.text("This is to certify that", 148, 90, {align: 'center'});
    doc.setFontSize(30);
    doc.setTextColor(99, 102, 241);
    doc.text(name, 148, 110, {align: 'center'});
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`for successfully completing the course ${course}`, 148, 130, {align: 'center'});
    
    doc.addImage(qrImage, 'PNG', 130, 150, 40, 40);
    doc.setFontSize(10);
    doc.text(certId, 150, 195, {align: 'center'});

    doc.save(`${name}-certificate.pdf`);
};