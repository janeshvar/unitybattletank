private var tankList : GameObject[];
private var target : GameObject;
private var canTravel : boolean[] = new boolean[4]; // N E S W directions (orientated for the tank)
private var canTravelBack : boolean[] = new boolean[4];
private var canTravelFront : boolean[] = new boolean[4];
private var shootScript : FireProjectile;

private var idleTime : float = 0.1;
private var attackTime : float = 0.5;


function Start () {
	var tempTankList : GameObject[];
	tempTankList = GameObject.FindGameObjectsWithTag("Tank");
	tankList = new GameObject[tempTankList.length - 1];
	
	var counter : int = 0;
	for(var i : int = 0; i < tempTankList.length; i++) {
		if(tempTankList[i] != gameObject) {
			tankList[counter] = tempTankList[i];
			counter++;
		}
	}
	
	shootScript = gameObject.GetComponent(FireProjectile);
	
	while(true) {
	//while(false) {
		yield PingPlayers(); // If we don't want to implement this, we should just remove it
		yield Explore();
		yield Attack();
	}
}

function Update() {
}


function PingPlayers() {
	
	yield WaitForSeconds(0);
}


function Explore() {
	while(true) {
		// Search for any visible tanks
		for(var i : int = 0; i < tankList.length; i++) {
			var rayInfo : RaycastHit;
			if(!Physics.Linecast(transform.position, tankList[i].transform.position, rayInfo)) {
				//Debug.Log("I CAN SEE TANK " + i + "!  FIRE!!!");
				target = tankList[i];
				return;
			}
		}
		
		// No tanks found, we need to search for our surroundings
		
		var myPos : Vector3;
		var angle : float;
		
		var dist : float = 0.75;
		var offset : float = 0.4;
		var initOffset : float = 0.35;
		angle = Mathf.Atan2(transform.forward.z, transform.forward.x);
		var right : Vector3 = new Vector3(Mathf.Cos(angle - Mathf.PI / 2), 0, Mathf.Sin(angle - Mathf.PI / 2));
		var back : Vector3 = new Vector3(transform.forward.x * -1, 0, transform.forward.z * -1);
		var left : Vector3 = new Vector3(Mathf.Cos(angle + Mathf.PI / 2), 0, Mathf.Sin(angle + Mathf.PI / 2));
		
		myPos = transform.position + (initOffset + offset) * transform.forward;
		canTravelFront[0] = !Physics.Raycast(myPos, transform.forward, dist - offset);
			Debug.DrawRay(myPos, transform.forward * (dist - offset), Color.white);
		canTravelFront[1] = !Physics.Raycast(myPos, right, dist);
			Debug.DrawRay(myPos, right * dist, Color.red);
		canTravelFront[2] = true; // Assume true, but we'll check this on the back end
		canTravelFront[3] = !Physics.Raycast(myPos, left, dist);
			Debug.DrawRay(myPos, left * dist, Color.blue);
		
		myPos = transform.position + (initOffset - offset) * transform.forward;
		canTravelBack[0] = true; // Assume true, but we'll check this on the front end
		canTravelBack[1] = !Physics.Raycast(myPos, right, dist);
			Debug.DrawRay(myPos, right * dist, Color.red);
		canTravelBack[2] = !Physics.Raycast(myPos, back, dist - offset);
			Debug.DrawRay(myPos, back * (dist - offset), Color.white);
		canTravelBack[3] = !Physics.Raycast(myPos, left, dist);
			Debug.DrawRay(myPos, left * dist, Color.blue);
		
		for(i = 0; i < 4; i++)
			canTravel[i] = canTravelFront[i] && canTravelBack[i];
		
		for(i = 0; i < 4; i++)
			if(canTravel[i])
				Debug.Log("I can travel in direction: " + i);
		
		// Now, we need to choose a random direction from the above list and head that way
		// We should probably remember what we saw on the last update, so that we can detect when
		// the number of directions available changes.  If it increases, we're at an intersection, and we need
		// to choose a new direction to head.  If it decreases, we eight just got out of an intersection or we just
		// ran into a corner.  We also might want to remember which direction we were heading, so we can prevent
		// the tank from returning from where it came unless its the only direction available.
		
		yield WaitForSeconds(idleTime);
	}
	
}


function Attack() {
	var isVisible : boolean = true;
	while(isVisible) {
		// If they are turned closer to us, than we are to them, we need to run!
		// If we are turned closer to them, finish turning and FIRE (while moving closer)
		shootScript.ShootCannon();
		yield WaitForSeconds(attackTime);
		isVisible = !Physics.Linecast(transform.position, target.transform.position);
	}
}