var lifetime : int = 2;


function Start () {
	//print(GetInstanceID());
	Destroy(gameObject, 3);
}


function Update () {

}


function OnCollisionEnter(collision : Collision) {
	var ownerComp : ProjectileOwner = gameObject.GetComponent(ProjectileOwner);
	if(collision.gameObject.tag == "Tank") {
		if(ownerComp && collision.gameObject != ownerComp.owner) { // if we didn't fire the projectile
			//Debug.Log(ownerComp.owner);
			Destroy(gameObject);
		}
	} else {
		if(collision.gameObject.tag != "Projectile")
			Destroy(gameObject);
		else {
			var temp : Vector3 = collision.gameObject.transform.position;
			collision.gameObject.transform.position = gameObject.transform.position;
			gameObject.transform.position = temp;
		}
	}
}