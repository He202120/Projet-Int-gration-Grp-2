import nodemailer from 'nodemailer';


const sendMail = async (email, name , plate, testClub=false) => {
    
    const textes = `
    Dear ${name},

    We are pleased to confirm your registration to SmartParking.

    Registration Details:
    - Name: ${name}
    - Plate: ${plate}

    We hope you will appreciate our services. If you have any questions or need further information, please do not hesitate to contact us.

    Best regards,

    SmartParking
    SmartParking@gmail.com
    0439 52 66 41
    https://wetterenmanager.xyz/
    `;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: 'gmail',
            port: Number(process.env.MAIL_PORT),
            secure: true,
            auth: {
                user: process.env.MAIL_HOST,
                pass: process.env.MAIL_MDP,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_HOST,
            to: email,
            subject: "Confirmation of Registration - Wetteren Football Club",
            text: testClub ? textes : "Your registration for the Wetteren Club has been successfully submitted.",
        })
        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent!");
        console.log(error);
        return error;
    }
};

export default sendMail;
