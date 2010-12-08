var health : int = 2;
var score : int = 0;
var maxHealth : int = 2;

function Update() {
	// gameObject.transform.position.y = 0.55; // Keep the tank from flying off the map hack
}

function HandleCollision(otherGameObject : GameObject) {
	if(otherGameObject.tag == "Projectile") {
		var ownerComp : ProjectileOwner = otherGameObject.GetComponent(ProjectileOwner);
		if(ownerComp && ownerComp.owner != gameObject) { // if we didn't fire the projectile
			Destroy(otherGameObject); // delete the projectile
			health--;
		}
	}
		
	if(health <= 0) {
		//Destroy(gameObject);
		respawn(ownerComp.owner);
		var ownerTank : TankDamage = ownerComp.owner.GetComponent(TankDamage);
		if(ownerTank)
			ownerTank.score++;
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit) {
	HandleCollision(hit.gameObject);
}

function OnCollisionEnter(collision : Collision) {
	HandleCollision(collision.gameObject);
}

function respawn(otherTank : GameObject) {
	var respawns : GameObject[] = GameObject.FindGameObjectsWithTag("Respawn");
	var tanks : GameObject[] = GameObject.FindGameObjectsWithTag("Tank");
	if(!respawns || respawns.length == 0 || !tanks || tanks.length == 0) return;
	
	var largestAvgDistance : float = 0.0;
	var bestRespawn : GameObject = respawns[0];
	
	for(var currRespawn : GameObject in respawns) {
		var sumOfSqrtDistances : float = 0.0;
		for(var tank : GameObject in tanks) {
			sumOfSqrtDistances += Mathf.Sqrt(Vector3.Distance(currRespawn.transform.position, tank.transform.position));
		}
		
		var thisAvgDistance : float = sumOfSqrtDistances / tanks.length;
		if(thisAvgDistance > largestAvgDistance) {
			largestAvgDistance = thisAvgDistance;
			bestRespawn = currRespawn;
		}
	}
	
	transform.position = bestRespawn.transform.position - 0.35 * transform.forward;
		
	health = maxHealth;
}