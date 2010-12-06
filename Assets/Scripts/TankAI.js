private var tankList : GameObject[];
private var target : GameObject;
private var canTravel : boolean[] = new boolean[4]; // N E S W directions (orientated for the tank)
private var canTravelBack : boolean[] = new boolean[4];
private var canTravelFront : boolean[] = new boolean[4];
private var shootScript : FireProjectile;

private var idleTime : float = 0.1;
private var attackTime : float = 0.5;

var enemyCheckDelay : int = 0; // 1 skips 1 frame, 2 skps 2 frames, etc...
private var currEnemyCheck : int = 0; // Private counter - ignore

var locationCheckDelay : int = 0; // 1 skips 1 frame, 2 skips 2 frames, etc...
private var currLocationCheck : int = 0; // Private counter - ignore



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
	
	//if(!gameObject.GetComponent(CharacterController)) { // Uncomment to have TankAI script ignore players
		while(true) {
		//while(false) { // Swap this with the line above it to execute the Update() function, else it'll never be called
			yield PingPlayers(); // If we don't want to implement this, we should just remove it
			yield Explore();
			yield Attack();
		}
	//} // Uncomment to have TankAI script ignore players
}


function Update() {
	// This is never called unless the loop above exits
	
}


function PingPlayers() {
	
	yield WaitForSeconds(0);
}


function Explore() {
	while(true) {
		var myPos : Vector3;
		var angle : float;
		var dist : float = 0.75; // Distance from center of tank to check for walls
		var offset : float = 0.4; // Offset to check for path clearance
		var initOffset : float = 0.35; // This compensates to make transform.position in center of tank image
		
		myPos = transform.position + initOffset * transform.forward;
		
		// Search for any visible tanks
		if(currEnemyCheck >= enemyCheckDelay) {
			for(var i : int = 0; i < tankList.length; i++) {
				var rayInfo : RaycastHit;
				if(!Physics.Linecast(myPos, tankList[i].transform.position + initOffset * tankList[i].transform.forward, rayInfo)) {
					// This would return true if something collided, so, if false, then we have a clear shot!
					target = tankList[i]; // Save target info for later when we persue him
					return; // This escapes the yield in the state machine
				}
			}
			currEnemyCheck = 0;
		} else {
			currEnemyCheck++;
		}
		
		// No tanks found, we need to search our surroundings
		if(currLocationCheck >= locationCheckDelay) {
			angle = Mathf.Atan2(transform.forward.z, transform.forward.x);
			var right : Vector3 = new Vector3(Mathf.Cos(angle - Mathf.PI / 2), 0, Mathf.Sin(angle - Mathf.PI / 2));
			var back : Vector3 = new Vector3(transform.forward.x * -1, 0, transform.forward.z * -1);
			var left : Vector3 = new Vector3(Mathf.Cos(angle + Mathf.PI / 2), 0, Mathf.Sin(angle + Mathf.PI / 2));
			
			myPos = transform.position + (initOffset + offset) * transform.forward;
			canTravelFront[0] = !Physics.Raycast(myPos, transform.forward, dist - offset);
				//Debug.DrawRay(myPos, transform.forward * (dist - offset), Color.white);
			canTravelFront[1] = !Physics.Raycast(myPos, right, dist);
				//Debug.DrawRay(myPos, right * dist, Color.red);
			canTravelFront[2] = true; // Assume true, but we'll check this on the back end
			canTravelFront[3] = !Physics.Raycast(myPos, left, dist);
				//Debug.DrawRay(myPos, left * dist, Color.blue);
		
			myPos = transform.position + (initOffset - offset) * transform.forward;
			canTravelBack[0] = true; // Assume true, but we'll check this on the front end
			canTravelBack[1] = !Physics.Raycast(myPos, right, dist);
				//Debug.DrawRay(myPos, right * dist, Color.red);
			canTravelBack[2] = !Physics.Raycast(myPos, back, dist - offset);
				//Debug.DrawRay(myPos, back * (dist - offset), Color.white);
			canTravelBack[3] = !Physics.Raycast(myPos, left, dist);
				//Debug.DrawRay(myPos, left * dist, Color.blue);
			
			for(i = 0; i < 4; i++)
				canTravel[i] = canTravelFront[i] && canTravelBack[i];
			
			for(i = 0; i < 4; i++)
				if(canTravel[i])
					Debug.Log("I can travel in direction: " + i);
			
			currLocationCheck = 0;
		} else {
			currLocationCheck++;
		}
		
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