import {tool} from "ai";
import {z} from "zod";
import {extractVacature} from "@/lib/vacature/actions";

export const analyseerVacature = tool({
    description: "Gebruik deze tool wanneer de gebruiker een bestaande vacaturetekst in de chat plakt, ook als er niet expliciet om een analyse wordt gevraagd. Analyseer de aangeleverde tekst en haal de belangrijkste vacaturegegevens eruit. Gebruik deze tool niet om nieuwe vacatures te zoeken.",
    inputSchema: z.object({
        tekst: z.string()
            .describe("De volledige vacaturetekst.")
    }),
    execute: async ({tekst}) => {
        console.log("De analyseervacature wordt aangeroepen!")

        const response = await extractVacature(tekst);
        if (!response.vacature) {
            throw new Error(response.error ?? "Er ging iets mis")
        }
        console.log(response);
        return response
    },
})