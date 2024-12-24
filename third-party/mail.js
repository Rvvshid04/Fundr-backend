const PDFDocument = require('pdfkit');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to generate a PDF receipt
function generatePDFReceipt(donorName, donationAmount, campaignName) {
    const doc = new PDFDocument();
    const filePath = `./receipts/${donorName}_receipt.pdf`; // Store the PDF in the 'receipts' folder

    // Ensure the receipts directory exists
    if (!fs.existsSync('./receipts')) {
        fs.mkdirSync('./receipts');
    }

    doc.pipe(fs.createWriteStream(filePath)); // Write the PDF to a file

    doc.fontSize(20).text('Donation Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Dear ${donorName},`);
    doc.text(`Thank you for your generous donation of $${donationAmount} to our campaign "${campaignName}".`);
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Amount Donated: $${donationAmount}`);
    doc.text(`Campaign Name: ${campaignName}`);
    doc.moveDown();
    doc.text('We greatly appreciate your support!');
    doc.end();

    return filePath; // Return the path of the generated PDF
}

// Email Sending Function with PDF attachment using SendGrid
async function sendThankYouEmailWithReceipt(donorEmail, donorName, donationAmount, campaignName) {
    const receiptPath = generatePDFReceipt(donorName, donationAmount, campaignName);

    const emailContent = `
        <p>Dear ${donorName},</p>
        <p>Thank you for your generous donation of <strong>$${donationAmount}</strong> to our campaign "<strong>${campaignName}</strong>".</p>
        <p>Please find your receipt attached.</p>
        <p>Warm regards,<br>Your Organization</p>
    `;

    try {
        const emailOptions = {
            to: donorEmail,
            from: 'your-organization@example.com', // Replace with your SendGrid verified sender email
            subject: 'Your Donation Receipt',
            html: emailContent,
            attachments: [
                {
                    content: fs.readFileSync(receiptPath).toString('base64'), // Read the file and encode it
                    filename: `${donorName}_receipt.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        };

        await sgMail.send(emailOptions);
        console.log(`Email with receipt sent to ${donorEmail}`);
    } catch (error) {
        console.error('Failed to send email with receipt:', error);
    }
}

module.exports = { sendThankYouEmailWithReceipt };
