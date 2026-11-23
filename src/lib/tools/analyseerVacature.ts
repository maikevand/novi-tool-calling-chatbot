import {tool} from "ai";
import {z} from "zod";
import {extractVacature} from "@/lib/vacature/actions";

export const analyseerVacature = tool({
    description: "Als de gebruiker een vacaturetekst in de chat plakt, vat die vacature dan samen en haal de belangrijkste punten eruit.",
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