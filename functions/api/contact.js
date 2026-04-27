export async function onRequestPost({ request }) {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        
        let contentStr = '';
        for (const [key, value] of Object.entries(data)) {
            contentStr += `${key}: ${value}\n`;
        }

        const sendRequest = new Request("https://api.mailchannels.net/tx/v1/send", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: "hello@ech0.work", name: "ECH0 STUDIO" }],
                    },
                ],
                from: {
                    email: "noreply@ech0.work",
                    name: "Website Contact Form",
                },
                subject: `New form submission from ${data['First-name'] || 'Website User'}`,
                content: [
                    {
                        type: "text/plain",
                        value: `A new message was received from the contact form:\n\n${contentStr}`
                    }
                ]
            })
        });

        const res = await fetch(sendRequest);
        if (res.ok) {
            // Webflow standard redirect/response handling, or we just return a 200 with JSON
            return new Response(JSON.stringify({ success: true, message: "Sent successfully" }), {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: "Error sending email" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
