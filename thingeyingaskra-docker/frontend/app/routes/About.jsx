function About(props) {
	return <div>
		<div className="pb-6 px-6 md:px-0 border-b border-gray-300 mb-10">
			<h1 className="text-3xl">Um þessa útgáfu</h1>
		</div>
		<p className="text-lg max-w-prose">Þessi vefur býður upp á aðgang að Þingeyingaskrá Konráðs Vilhjálmssonar. Skráin var skönnuð inn með stuðningi frá Þjóðskjalasafni Íslands og er aðgengileg á vef Héraðsskjalasafns Þingeyinga.<br/>
		Nú hefur skráin verið tölvulesin og upplýsingum í henni komið skipulega fyrir í gagnagrunni. Á þessu vef má því leita í skránni eftir nöfnum fólks en einni bæjarnöfnum, stöðu fólks og fleiru sem leynist í texta skrárinnar. Texti skránnar var lesinn með Google Gemini 3 Flash Preview. Þar sem um sjálfvirkan lestur á um 15000 síðum er um að ræða er ljóst að í þessari útgáfu leynast margar villur. Þó er búið að laga margar þeirra með því til dæmis að finna bæjarnöfn og mannanöfn í sjálfvirku textunum sem ekki finnast í bæjarnafnaskrám eða mannanafnaskrám, þannig er hægt að laga augljósar villur á borð við "Amstapi" sem á að vera "Arnstapi", "Sílalakur" sem á að vera "Sílalækur" eða þegar nöfn eru lesin vitlaust eins og "Gudmundur" eða "Johanna".<br/>
		Bæjarnöfn í skránni hafa verið kortlögð að mestu og því er hægt að sjá alla bæina á korti. Þegar heildarkort er skoðað birtast bæirnir sem hringir og sýnir stærð þeirra fjölda fólks á hverjum bæ í skránni allri. Ekki er víst að allt sér rétt þegar kemur að bæjunum. Bæjarnöfn eins og Þverá, Bakki og Skógar eru til á fleiri en einum stað. Því er ljóst að ekki alltaf augljóst hvaða bæ átt er við þegar minnst er á til dæmis Þverá í skránni þótt Konráð skrifi oftast skammstöfun svæðis fyrir aftan, til dæmis "Þverá L." eða "Bakki Fn.".<br/>
		Því er ljóst að enn leynast villur á stöku stað en þó veitir aðgangur að skránni á þennan hátt mun meiri möguleika en skannaða skráin.</p>
	</div>
}

export default About;