var health : int = 2;
var kills : int = 0;

var struckSound: AudioClip;
var deathSound: AudioClip;


function Awake() {
	
}


function GetHealth() : int {
	return health;
}


function GetKills() : int {
	return kills;
}


function ApplyDamage (damage : int) {
	if (struckSound)
		AudioSource.PlayClipAtPoint(struckSound, transform.position);

	health -= damage;
	if (health <= 0) {
		Die();
	}
}


function Die () {
	if (deathSound) {
		AudioSource.PlayClipAtPoint(deathSound, transform.position);
	}
	SendMessage("Die");
}