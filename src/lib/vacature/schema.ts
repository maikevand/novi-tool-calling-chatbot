import {z} from 'zod'

// Toegevoegd: .describe() bij elk veld en een veld salarisMax, zodat het schema voldoet aan de eisen van huiswerk Les 11
export const vacatureSchema = z.object({
    functietitel: z.string().describe('De functietitel zoals die in de vacature staat'),
    bedrijf: z.string().nullable().describe('Naam van het bedrijf, of null als die niet in de tekst staat'),
    niveau: z.enum(['junior', 'medior', 'senior', 'onbekend']).describe('Ervaringsniveau van de functie, of onbekend als dat niet duidelijk is'),
    salarisMin: z.number().int().nullable().describe('Minimum bruto maandsalaris in euro, of null als er geen salaris in de tekst staat'),
    salarisMax: z.number().int().nullable().describe('Maximum bruto maandsalaris in euro, of null als er geen maximum in de tekst staat'),
    vaardigheden: z.array(z.string()).describe('Gevraagde vaardigheden en technieken, zoals React of TypeScript'),
    remote: z.boolean().describe('true als thuiswerken of remote werken expliciet mogelijk is, anders false'),
});

export type Vacature = z.infer<typeof vacatureSchema>;
