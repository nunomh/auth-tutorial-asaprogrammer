import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailsTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) =>
{
	const recipient = [{ email }]

	try
	{
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify Your Email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification"
		})
	} catch (error)
	{
		console.error(`Error sending verification email: ${error.message}`);
		throw new Error(`Error sending verification email: ${error.message}`);
	}
}

export const sendWelcomeEmail = async (email, name) =>
{
	const recipient = [{ email }]
	try
	{
		await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "027dd23f-7698-4250-9538-e24a4265a696",
			template_variables: {
				"name": name,
				"company_info_name": "Auth Project"
			}
		})
	} catch (error)
	{
		console.error(`Error sending welcome email: ${error.message}`);
		throw new Error(`Error sending welcome email: ${error.message}`);
	}
}

export const sendPasswordResetEmail = async (email, resetURL) =>
{
	const recipient = [{ email }];

	try
	{
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error)
	{
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};