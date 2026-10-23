export function meta() {
	return [
		{ title: "Þingeyingaskrá Konráðs Vilhjálmssonar" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

function About(props) {
	return <div>
		<div className="pb-6 px-6 md:px-0 border-b border-gray-300 mb-10">
			<h1 className="text-3xl">Um þessa útgáfu</h1>
		</div>
		<div className=" max-w-3xl">
			<p className="text-lg mb-4">Þessi vefur býður upp á aðgang að Þingeyingaskrá Konráðs Vilhjálmssonar. Skráin var skönnuð inn með stuðningi frá Þjóðskjalasafni Íslands og er aðgengileg á <a className="underline" href="https://www.husmus.is/is/heradsskjalasafn/skjalavefur/onnur-skjol/thingeyingaskra">vef Héraðsskjalasafns Þingeyinga</a>.</p>
			<p className="text-lg mb-4">Þingeyingaskrá Konráðs Vilhjálmssonar er uppflettiskrá yfir rúmlega 15.000 einstaklinga sem
	voru á lífi á 19. öld í Þingeyjarsýslum. Elstu einstaklingarnir í skránni voru fæddir skömmu eftir
	1700 og þeir yngstu á síðustu árum 19. aldarinnar. Konráð Vilhjálmsson (1885-1962) var kennari
	og fræðimaður, fæddur á Sandi í Aðaldal og bjó á Hafralæk og síðar á Akureyri. Hann vann að
	verkinu um árabil og sótti heimildir langmest í prestþjónustubækur og manntöl. Skráin byggir á
	nöfnum einstaklinga í stafrófsröð þar sem hægt er að sjá búsetusögu hvers og eins samkvæmt
	heimildum. Þar tilgreinir Konráð fæðingar og dánardag, nöfn foreldra og maka, ef þær
	upplýsingar liggja fyrir, og á hvaða árum einstaklingurinn bjó á hverjum bæ sem tilgreindur er.
	Einnig er tilgreind staða einstaklings auk neðanmálsgreina.
	Skráin telur 72 handskrifaðar bækur og er frumrit þeirra geymt á Héraðsskjalasafninu á Húsavík.
	Á allra síðustu árum hafa bækurnar verið skannaðar inn með stuðningi frá Þjóðskjalasafni
	Íslands og eru aðgengilegar á vef Menningarmiðstöð Þingeyinga.</p>
			<p className="text-lg mb-4">Nú hefur skráin verið tölvulesin og upplýsingum í henni komið skipulega fyrir í gagnagrunni. Á þessu vef má því leita í skránni eftir nöfnum fólks en einni bæjarnöfnum, stöðu fólks og fleiru sem leynist í texta skrárinnar. Texti skránnar var lesinn með Google Gemini 3 Flash Preview. Þar sem um sjálfvirkan lestur á um 15000 síðum er um að ræða er ljóst að í þessari útgáfu leynast margar villur. Þó er búið að laga margar þeirra með því til dæmis að finna bæjarnöfn og mannanöfn í sjálfvirku textunum sem ekki finnast í bæjarnafnaskrám eða mannanafnaskrám, þannig er hægt að laga augljósar villur á borð við "Amstapi" sem á að vera "Arnstapi", "Sílalakur" sem á að vera "Sílalækur" eða þegar nöfn eru lesin vitlaust eins og "Gudmundur" eða "Johanna".</p>
			<p className="text-lg mb-4">Bæjarnöfn í skránni hafa verið kortlögð að mestu og því er hægt að sjá alla bæina á korti. Þegar heildarkort er skoðað birtast bæirnir sem hringir og sýnir stærð þeirra fjölda fólks á hverjum bæ í skránni allri. Ekki er víst að allt sér rétt þegar kemur að bæjunum. Bæjarnöfn eins og Þverá, Bakki og Skógar eru til á fleiri en einum stað. Því er ljóst að ekki alltaf augljóst hvaða bæ átt er við þegar minnst er á til dæmis Þverá í skránni þótt Konráð skrifi oftast skammstöfun svæðis fyrir aftan, til dæmis "Þverá L." eða "Bakki Fn.".</p>
			<p className="text-lg mb-4">Því er ljóst að enn leynast villur á stöku stað en þó veitir aðgangur að skránni á þennan hátt mun meiri möguleika en skannaða skráin.</p>
			<p className="text-lg mb-4">Vefurinn er unnin af <a className="underline" href="https://eggald.in">Trausta Dagssyni</a>.</p>
		</div>
	</div>
}

export default About;