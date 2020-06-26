import constants from './constants';
const { GERMS, LEUKS, GERM, LEUK } = constants;


export default function placeGerms ( newGerms, bubbleState ) {
	const random = ( v1, v2, v3 ) => v1 + Math.random() * ( v2 - v1 ) > v3;
	
	function getTotal( type ){
		let keys = Object.keys(bubbleState);
		//alert(bubbleState[0].germs)
		let lists = keys.map( key=>bubbleState[key][type] )
		let counts = lists.map( list => list.length)
		if ( type == LEUKS ){
			//alert(counts);
		}
		return Object.keys(bubbleState)
					.map( bubbleKey => bubbleState[bubbleKey][type].length )
					.reduce(( totalCount, nextBubbleCount )  => totalCount + nextBubbleCount, 0  );
	}
	const germsInBubbles = getTotal( GERMS )
	const totalGerms = newGerms + germsInBubbles;
	const leuksInBubbles = getTotal( LEUKS );
	const totalCells = germsInBubbles + leuksInBubbles;
	const overallDiff = germsInBubbles -leuksInBubbles;
	const germPercent = germsInBubbles / totalCells;
	const diffVsTotal = Math.abs( overallDiff / totalCells );
	const bubbleKeys = Object.keys(bubbleState);
	const baseline = Math.floor( totalGerms  / bubbleKeys.length )
	//const remainder = totalGerms % bubbleKeys.length;
	const diffs = bubbleKeys.map( key => bubbleState[key].germs.length - bubbleState[key].leuks.length );
	const best = Math.max(...diffs)
	const worst = Math.min(...diffs)
	const averageDiff = overallDiff/bubbleKeys.length;
	const adjustmentSize = Math.floor( totalGerms / 5 );
	
	let germsRemaining = totalGerms; 
	let bestKey = bubbleKeys[ diffs.indexOf( best )];
	let worstKey = bubbleKeys[ diffs.indexOf( worst )];

	let available = totalGerms
	let allocations = {}
	let riskyGambit;

	const strategicAdjust = ( key , num1 , num2 ) => {
		//if this bubble is doing better than average, ( and no risky gambit )
		if ( num1 > num2 && available >= adjustmentSize ){
			//allocate an extra germ to it,
			allocations[key]+=adjustmentSize;
			//factor in that available germs has decreased
			available-=adjustmentSize;
		} else if ( num1 < num2 ) {
			//else, take one germ away
			allocations[key]-=adjustmentSize
			available+=adjustmentSize;
		}
	}

	bubbleKeys.forEach( key =>{
		allocations[key] = available > baseline ? baseline : available;
		available -= allocations[key];
		let localDiff = bubbleState[key].germs - bubbleState[key].leuks
		riskyGambit = random( 0, 10, 8 );
		if ( !riskyGambit ){
			strategicAdjust( key, localDiff, averageDiff );
		} else {
			strategicAdjust( key, averageDiff, localDiff );
		}
		//strategicAdjust( key, localDiff, averageDiff );

	})

	//console.log( allocations );

	

	//decide how to allocate any germs leftover after the forEach loop 
	//console.log( 'available before', available ); 
	if ( available ){
		let allocateRemainderToBest = random( 0, 10, 4 ),
		    chosen = 0;
		if ( allocateRemainderToBest ){
			chosen = bestKey;
		} else {
			let notTheBestBubbles = bubbleKeys.slice().splice( bubbleKeys.indexOf( bestKey ), 1);
			chosen = notTheBestBubbles[ Math.floor( Math.random() * notTheBestBubbles.length ) ];
		}

		//console.log( bubbleKeys.indexOf(chosen) > -1 ); 
		allocations[chosen] += available;
		available -= available;
	}
	//console.log( 'available after', available ); 
	//bubbleKeys.forEach( key => console.log( key, allocations[key] ) );
	/* 
	if bool makeAConsolidationPlay rolls 'true' ( 70% chance ), computer makes 
	a final adjustment that strengthens its best position at the
	expense of its most tenuous position.
	*/

	let makeAConsolidationPlay = random( 0, 10, 3);
	if ( makeAConsolidationPlay ){
		let worstKeyTotal = allocations[worstKey],
		bestKeyTotal = allocations[bestKey],
		worstKeyDistAbove1 = worstKeyTotal-1

		if ( overallDiff >= 0) {
			allocations[worstKey] = 1;
			allocations[bestKey] += worstKeyDistAbove1;
			/*add any leftover germs to best key
			allocations[bestKey] += available
			//set available to 0
			available -= available*/
		} else {
			allocations[worstKey] = 0;
			allocations[bestKey] +=  worstKeyTotal;
			/*add any leftover germs to best key
			allocations[bestKey] += available;
			//set available to 0
			available -= available;*/
		}
	}

	if ( available > 0){
		alert( 'failed not enough: ' + overallDiff )
		allocations[bestKey] += available;
		available -= available;
	} else if ( available < 0 ){
		alert('allocated too many germs')
	}
	//bubbleKeys.forEach( key => console.log( key, allocations[key] ) );
	return allocations;
/*
	if ( overallDiff > 0 ){
		index = 
	} else if ( overallDiff < 0 ) {
		if ( diffVsTotal )
	}




	bubbleKeys.forEach(( key, i ) => {
		const bubble = bubbleState[key], 
			  { germs, leuks } = bubble,
			  localCells = germs + leuks,
			  localDiff = germs - leuks,
			  winning = localDiff > 0,
			  localGermPercent = germs / localCells,
			  localDiffVsTotal = localDiff / localCells,
			  relStr = localDiff/overallDiff,
			 
		let expected = .2, magnitude = .6;

		
	})*/
}