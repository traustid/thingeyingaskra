import TabContainer from "~/components/TabContainer";
import type { Route } from "./+types/home";
import Persons from "./Persons";
import Places from "./Places";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Þingeyingaskrá Konráðs Vilhjálmssonar" },
		{ name: "description", content: "Í Þingeyingaskrá Konráðs Vilhjálmssonar er fimmtán þúsund Þingeyingum fylgt frá vöggu til grafar. Konráð Vilhjálmsson fræðimaður vann að skránni í meira enn áratug. Verkið er byggt að miklu leyti á manntölum prestanna. Verkinu skipti Konráð niður í 72 bækur. Fremst í hverri bók er nafnalisti." },
	];
}

export default function Home() {
	return <div>
		<TabContainer tabs={[
			{
				'title': 'Einstaklingar',
				'element': <Persons />
			},
			{
				'title': 'Staðir',
				'element': <Places />
			}
		]} />
	</div>
}
