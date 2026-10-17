import { useEffect, useState } from "react";
import _ from 'underscore';
import Panel from "./Panel";

function TabContainer(props) {
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		setSelectedTab(0);
	}, [props.tabs])

	return <div>
		<div className="flex pl-2">
			{
				props.tabs.map((tab, index) => <div key={index} className={'cursor-pointer px-5 py-2'+(tab.hidden ? ' hidden' : ' block')+(index == selectedTab ? '  border-b border-b-orange-400 border-b-2' : '')} onClick={() => setSelectedTab(index)}>{tab.title}</div>)
			}
		</div>
		{
			props.tabs.map((tab, index) => <Panel key={index} className={(tab.hidden ? ' hidden' : ' block')+(index == selectedTab ? ' opacity-100 mb-4 p-6 ' : ' !mb-0 !p-0 opacity-0 !border-none h-0 pointer-events-none')}>
				{tab.element}
			</Panel>)
		}
	</div>
}

export default TabContainer;