// Toegevoegd: aparte functie in src/lib die een gecontroleerde vacature opslaat, zoals saveChat() bij de chatgeschiedenis
import {createSupabaseServerClient} from '@/lib/supabase/server';
import type {Vacature} from '@/lib/vacature/schema';

export async function saveVacature(vacature: Vacature, tekst: string) {
    const supabase = createSupabaseServerClient();

    // camelCase uit het schema wordt hier omgezet naar snake_case in de database
    const {error} = await supabase
        .from('vacatures')
        .insert({
            functietitel: vacature.functietitel,
            bedrijf: vacature.bedrijf,
            niveau: vacature.niveau,
            salaris_min: vacature.salarisMin,
            salaris_max: vacature.salarisMax,
            vaardigheden: vacature.vaardigheden,
            remote: vacature.remote,
            tekst,
        });

    if (error) throw error;
}
