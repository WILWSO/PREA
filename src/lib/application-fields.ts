export const identityFields = [
	{ name: 'full_name', label: 'Nombre completo', type: 'text' },
	{ name: 'church', label: 'Iglesia o ministerio', type: 'text' },
	{ name: 'denomination', label: 'Denominación eclesiástica', type: 'text' },
	{ name: 'theological_education', label: 'Formación teológica', type: 'textarea' },
	{ name: 'institution_studied', label: 'Institución donde estudió', type: 'text' },
	{ name: 'phone', label: 'Teléfono de contacto', type: 'tel' },
	{ name: 'email', label: 'Correo electrónico', type: 'email' },
	{ name: 'ministry_institution', label: 'Institución que representa o dirige', type: 'text' },
	{ name: 'confession', label: 'Confesión de fe o declaración doctrinal', type: 'textarea' },
	{ name: 'city', label: 'Localidad o ciudad', type: 'text' },
	{ name: 'province', label: 'Provincia', type: 'text' }
] as const;

export const doctrinalFields = [
	{
		name: 'scripture',
		label: 'Sagradas Escrituras: inspiración, inerrancia, suficiencia y autoridad'
	},
	{
		name: 'salvation',
		label: 'Salvación: doctrinas de la gracia, elección, regeneración y justificación'
	},
	{ name: 'covenants', label: 'Pactos: teología del pacto, dispensacionalismo u otra postura' },
	{
		name: 'giving',
		label: 'Diezmos y ofrendas: obligatoriedad del 10 % y sostenimiento de la iglesia'
	},
	{
		name: 'spiritual_gifts',
		label: 'Dones espirituales: cesacionismo, continuacionismo, lenguas, profecía y sanidad'
	},
	{ name: 'eschatology', label: 'Escatología: segunda venida, resurrección, juicio y consumación' },
	{
		name: 'millennium',
		label: 'Milenio: amilenialismo, premilenialismo, postmilenialismo y Apocalipsis 20'
	},
	{
		name: 'church_government',
		label: 'Gobierno eclesiástico: presbiteriano, congregacional, episcopal u otro'
	},
	{
		name: 'sacraments',
		label: 'Sacramentos: bautismo infantil, bautismo de creyentes y Santa Cena'
	},
	{ name: 'worship', label: 'Culto y adoración: principio regulador del culto' },
	{
		name: 'pastoral_ministry',
		label: 'Ministerio pastoral: ordenación, oficiales y ministerio femenino'
	},
	{ name: 'discipline', label: 'Iglesia y disciplina: membresía y autoridad de la iglesia' },
	{ name: 'holy_spirit', label: 'Espíritu Santo: bautismo, llenura y santificación' },
	{
		name: 'prosperity',
		label: 'Prosperidad y sanidad: teología de prosperidad y declaraciones de fe'
	},
	{ name: 'confessionalism', label: 'Confesionalidad: Westminster, Tres Formas de Unidad u otras' }
] as const;

export const applicationFieldNames = [
	...identityFields.map((field) => field.name),
	...doctrinalFields.map((field) => field.name)
] as const;

export type ApplicationValues = Record<(typeof applicationFieldNames)[number], string>;
