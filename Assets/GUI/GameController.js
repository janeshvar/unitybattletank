@script ExecuteInEditMode()

var gameTimer : float = 120.0;
// Game timer in seconds


var gameTimerTextScale : float = 1.5;
var playerNameTextScale : float = 1.0;
var playerScoreTextScale : float = 1.0;
private var tankDamage1 : TankDamage;
private var tankDamage2 : TankDamage;
var GUICustomSkin : GUISkin;
private var tankList : GameObject[];

private var guiStyles : GUIStyle[];
private var texs : Texture2D[];



function Start () {
	tankList = GameObject.FindGameObjectsWithTag("Tank");
	for(var count : int = 0; count < tankList.length; count++) {
		tankList[count] = gameObject.Find("Player" + (count + 1) + "Tank");
	}
	
	texs = new Texture2D[tankList.length];
	for(var i : int = 0; i < texs.length; i++)
		texs[i] = new Texture2D(16, 16, TextureFormat.ARGB32, false);
	
	guiStyles = new GUIStyle[tankList.length];
	for(var j : int = 0; j < guiStyles.length; j++) {
		guiStyles[j] = new GUIStyle();
		guiStyles[j].normal.background = texs[j];
	}
	
	for(var a : int = 0; a < tankList.length; a++) {
		var style : GUIStyle = GUICustomSkin.GetStyle("Player" + a);
		var lightObject : GameObject;
		lightObject = tankList[a].Find("Light" + (a + 1));
		if(!lightObject)
			Debug.Log("Could not find \"Light\" GameObject attached to tank!");
		else {
			var lgt : Light;
			lgt = lightObject.light;
			if(!lgt)
				Debug.Log("No \"Light\" component attached to the light");
			else {
				var color : Color = lgt.color;
				color.r = color.r / 2.0;
				color.g = color.g / 2.0;
				color.b = color.b / 2.0;
				for(var x : int = 0; x < texs[a].width; x++)
					for(var y : int = 0; y < texs[a].height; y++)
						texs[a].SetPixel(x, y, color);
				texs[a].name = "Player" + a;
				texs[a].Apply();
				style.normal.background = texs[a];
			}
		}
	}
}




// This script should monitor for the number of tanks alive, as well as allow the tanks to ping() to get
// the position of the other tanks.
// This script should also be in charge of watching the game timer and ending the game when it hits 0.
function Update () {
	gameTimer -= Time.deltaTime;
	
	if(gameTimer <= 0)
		Application.LoadLevel("GameOver");
}


function OnGUI() {
	if (GUICustomSkin)
		GUI.skin = GUICustomSkin;
	// Transform matrix for (trasform, rotate, scale) - This just allows automatic scaling for everything that uses this matrix
	// Setting GUI.matrix to some other value will only affect the GUI stuff below it
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * gameTimerTextScale);
	
	var minutes : int = gameTimer / 60;
	var seconds : int = gameTimer - (60 * minutes);
	var timerGUI : String = minutes.ToString() + ":";
	if(seconds < 10) {
		timerGUI = timerGUI + "0" + seconds.ToString();
	} else {
		timerGUI = timerGUI + seconds.ToString();
	}
	GUI.Label(Rect(5, 10, 50, 50), timerGUI, "MenuText");
	
	
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * playerNameTextScale);
	if(!tankList)
		return;
	for(var a : int = 0; a < tankList.length; a++) {
		var tank : GameObject = tankList[a];
		var playerNum : int = a + 1;
		var nameStr : String = "Player: " + playerNum.ToString();
		var healthStr : String = "Health: ";
		var scoreStr : String = "Score: ";
		var tankDmg : TankDamage = tank.GetComponent(TankDamage);
		
		if(tankDmg) {
			healthStr += tankDmg.health;
			scoreStr += tankDmg.score;
		} else {
			healthStr += "Dead";
			scoreStr += "0";
		}
		
		var xVal : int = Screen.width - 60;
		GUI.Box(Rect(xVal - 3, 7 + 70 * a, 60, 50), "", guiStyles[a]);
		GUI.Label(Rect(xVal, 10 + 70 * a, 50, 50), nameStr, "MenuText");
		GUI.Label(Rect(xVal, 25 + 70 * a, 50, 50), healthStr, "MenuText");
		GUI.Label(Rect(xVal, 40 + 70 * a, 50, 50), scoreStr, "MenuText");
	}
	
}