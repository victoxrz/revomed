import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // https://southcla.ws/how-to-implement-logout-nextjs-cache-revalidate
  revalidatePath("/");
  (await cookies()).delete(process.env.AUTH_TOKEN_NAME!);

  return NextResponse.redirect(req.nextUrl.origin, {
    headers: {
      "Clear-Site-Data": `"*"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * polita de asigurare la form patient + backend
 * consimtamant subiectului - art 7 legea privind protectia datelor cu caracter personal ✅
 * https://medlife.md/legislatia/ord-1.pdf
 *
 * asistenta medicala:
 * triaj ✅
 * temperatura, tensiune arter., pulsul, frecventa respiratie
 * talia, greutatea
 * imc
 *
 * editarea sabloanelor
 * vizita:
 * acuzele ✅
 * + specialitatea medicului ✅
 *
 *
 * ordonarea vizitelor ✅
 *
 * TODO: clean all the default values in postgres tables
 */

/**
 * adaug info despre pacient in vizita si fisa medicala (doar) ✅ - print visita, medical report
 * adaug numerotare la vizite - pentru?
 * adaug subcampuri, anamneza subcategorie, formula dentara la digestiv (barat sau cu bifa sus la cifra) ✅ - partial
 * avc din triaj,
 * risc SCORE2,
 * obezitate - ✅
 * polita are nr serie - https://aoam.cnam.gov.md:10201/check-status ✅
 *
 *
 * dnd-kit, react-draggable, react-dropzone
 */

/**
 *
 * setup typography, where and what color to use - kind of finished
 * also setup the font sizes ✅
 * add straightforward way to search patients, and pagination
 * think about the way to simplify entering text, voice-typing, text templates, auto-complete system
 */
