import {tool} from "ai";
import {z} from "zod";

const adzunaSchema = z.object({
    results: z.array(
        z.object({
            title: z.string(),
            location: z.object({ display_name: z.string() }),
            salary_min: z.number().optional(),
            redirect_url: z.string(),
        }),
    ),
});

export const zoekVacatures = tool({
    description: "Zoek actuele vacatures in Nederland op functie of vaardigheid. Gebruik deze tool wanneer een gebruiker vraagt om vacatures te zoeken.",
    inputSchema: z.object({
        zoekwoord: z.string()
            .describe("Functie of vaardigheid, bijvoorbeeld react developer"),
        plaats: z.string().nullable()
            .describe("Plaats waar de gebruiker werk zoekt, bijvoorbeeld Utrecht. Gebruik null als geen locatie is opgegeven.")
    }),
    execute: async ({ zoekwoord, plaats}) => {
        console.log("Vacatures zoeken", zoekwoord, plaats);
        const endpoint = process.env.ADZUNA_APP_ENDPOINT_NL ?? ''
        const params = new URLSearchParams ({
            app_id: process.env.ADZUNA_APP_ID ?? '',
            app_key: process.env.ADZUNA_APP_KEY ?? '',
            what: zoekwoord,
            results_per_page: "5",
        })
        if (plaats) params.set("where", plaats);

        const response = await fetch(`${endpoint}/search/1?${params}`)

        if (!response.ok) {
            const foutmelding = await response.text();
            console.log("Foutmelding van Adzuna: ", foutmelding);
            throw new Error("De vacatures konden niet worden opgehaald. Probeer het later opnieuw.");
        }

        const data = adzunaSchema.parse(await response.json());
        const mappedResult = data.results.map((v) => ({
            titel: v.title ?? null,
            plaats: v.location.display_name ?? null,
            url: v.redirect_url ?? null }))
        console.log(mappedResult);
        return mappedResult;
    },
});