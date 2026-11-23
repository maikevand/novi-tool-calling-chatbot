'use server'

import {openai} from '@ai-sdk/openai';
import {generateText, NoObjectGeneratedError, Output} from 'ai';
import {vacatureSchema, type Vacature} from '@/lib/vacature/schema';
// Toegevoegd: import van de functie die een vacature opslaat in Supabase
import {saveVacature} from '@/lib/vacature/cruds';

export type VacatureResultaat = {
    vacature?: Vacature;
    error?: string;
};

const MAX_LENGTE = 5000;

export async function extractVacature(tekst: string): Promise<VacatureResultaat> {
    const schoneTekst = tekst.trim();

    if (!schoneTekst) {
        return {error: 'Plak eerst een vacaturetekst.'};
    }

    if (schoneTekst.length > MAX_LENGTE) {
        return {error: `De tekst is te lang (maximaal ${MAX_LENGTE} tekens).`};
    }

    try {
        const {output} = await generateText({
            model: openai('gpt-4o-mini'),
            instructions: 'Haal de gegevens uit de vacaturetekst. Gebruik alleen informatie die in de tekst staat.',
            prompt: schoneTekst,
            temperature: 0,
            output: Output.object({schema: vacatureSchema}),
        });

        // Toegevoegd: logische controle die het schema zelf niet kan doen
        if (output.salarisMin !== null && output.salarisMax !== null && output.salarisMin > output.salarisMax) {
            return {error: 'Het salaris lijkt niet te kloppen: het minimum is hoger dan het maximum.'};
        }

        return {vacature: output};
    } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
            console.error('Geen geldig vacature-object:', error.text);
            return {error: 'Het model gaf geen bruikbaar resultaat. Probeer het opnieuw.'};
        }

        console.error('Fout bij analyseren van vacature:', error);
        return {error: 'Er ging iets mis bij het analyseren van de vacature.'};
    }
}

// Toegevoegd: Server Action voor de knop in de chat, die analyseert en alleen een gecontroleerd resultaat opslaat
export async function analyseerEnBewaarVacature(tekst: string): Promise<VacatureResultaat> {
    const resultaat = await extractVacature(tekst);

    if (!resultaat.vacature) {
        return resultaat;
    }

    try {
        await saveVacature(resultaat.vacature, tekst.trim());
    } catch (error) {
        console.error('Fout bij opslaan van vacature:', error);
        return {vacature: resultaat.vacature, error: 'De vacature is geanalyseerd, maar kon niet worden opgeslagen.'};
    }

    return resultaat;
}
