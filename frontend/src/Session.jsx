import {supabase} from "./supabaseClient.js";

export default async function Session(){
    const {data: {session}} = await supabase.auth.getSession();
    return session;
}