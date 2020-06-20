import bcrypt from 'bcryptjs';
export async function encriptar(password: string): Promise<string> {
	try {
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (error) {
		throw new Error(`Error al encriptar contraseña, Error: ${error}`);
	}
}
export async function validar(password: string, hash: string): Promise<boolean> {
	try {
		let valido = await bcrypt.compare(password, hash);
		console.log(valido);
		return valido;
	} catch (error) {
		throw new Error(`Error al validar contraseña, Error: ${error}`);
	}
}
