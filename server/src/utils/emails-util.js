async function sendVerificationEmail(email, token) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <h1>Email Verification</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}">Verify Email</a>
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
        
    }
}

async function sendPasswordResetEmail(email, token) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
}

async function sendOrderReceivedEmail(email, orderDetails) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Order Received',
            html: `
                <h1>Order Confirmation</h1>
                <p>Your order has been received successfully.</p>
                <p>Order Details:</p>
                <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log('Order received email sent successfully');
    } catch (error) {
        console.error('Error sending order received email:', error);
        throw new Error('Failed to send order received email');
    }
}

async function sendOrderShippedEmail(email, trackingDetails) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Order Shipped',
            html: `
                <h1>Order Shipped</h1>
                <p>Your order has been shipped successfully.</p>
                <p>Tracking Details:</p>
                <pre>${JSON.stringify(trackingDetails, null, 2)}</pre>
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log('Order shipped email sent successfully');
    } catch (error) {
        console.error('Error sending order shipped email:', error);
        throw new Error('Failed to send order shipped email');
    }
}

async function sendOrderDeliveredEmail(email, deliveryDetails) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Order Delivered',
            html: `
                <h1>Order Delivered</h1>
                <p>Your order has been delivered successfully.</p>
                <p>Delivery Details:</p>
                <pre>${JSON.stringify(deliveryDetails, null, 2)}</pre>
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log('Order delivered email sent successfully');
    } catch (error) {
        console.error('Error sending order delivered email:', error);
        throw new Error('Failed to send order delivered email');
    }
}

async function sendOrderCancelledEmail(email, cancellationDetails) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Order Cancelled',
            html: `
                <h1>Order Cancelled</h1>
                <p>Your order has been cancelled.</p>
                <p>Cancellation Details:</p>
                <pre>${JSON.stringify(cancellationDetails, null, 2)}</pre>
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log('Order cancelled email sent successfully');
    } catch (error) {
        console.error('Error sending order cancelled email:', error);
        throw new Error('Failed to send order cancelled email');
    }
}


module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendOrderReceivedEmail,
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
    sendOrderCancelledEmail,
};