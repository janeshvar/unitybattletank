var damage : int = 1;
var reloadTime : int = 3;

var gunSound : AudioClip;

private var reloading : boolean = false; 
private var counter : float = 0.0;


function Update() {
	if(!reloading) {
		if(Input.GetButtonDown("Jump")) { // This should actually check for a "Shoot" message or something, not listen for a keydown
			SendMessage("Fire");
			reloading = true;
		}
	} else {
		counter += Time.deltaTime;
		if(counter >= reloadTime)
			reloading = false;
	}
	
}
