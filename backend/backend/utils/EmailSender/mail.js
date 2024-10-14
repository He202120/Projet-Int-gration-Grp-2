import nodemailer from 'nodemailer';


const sendMail = async (email, name , plate, testClub=false) => {
    
    const textes = `
    Dear ${name},

    We are pleased to confirm your registration to the Wetteren Football Club. Welcome to our team! We are excited to have you join us and look forward to a fantastic season ahead.

    Registration Details:
    - Name: ${name}
    - Plate: ${plate}

    As a member of the Wetteren Football Club, you will have the opportunity to participate in training sessions, matches, and club events. Here are some important details for you to note:

    Training Schedule:
    - Days: 3
    - Time: 8 pm
    - Location: Wetteren Stadium

    First Training Session:
    - Date: 16/05/2024
    - Time: 8 pm
    - Location: Wetteren Stadium

    What to Bring:
    - Proper training gear (jersey, shorts, socks, shin guards, and boots)
    - Water bottle
    - Any necessary medical items (e.g., inhalers)

    Membership Fee:
    Please ensure that your membership fee of [Amount] is paid by [Due Date]. Payment can be made via [Payment Method]. If you have already paid, please disregard this reminder.

    Contact Information:
    If you have any questions or need further information, please do not hesitate to contact us at [Club Email Address] or [Club Phone Number].

    Once again, welcome to the Wetteren Football Club. We look forward to seeing you on the field and working together towards a successful and enjoyable season.

    Best regards,

    ${name}
    ${plate}
    Wetteren Football Club
    WetterenManager@gmail.com
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
