@script ExecuteInEditMode()

var gameOverScale : float = 2.0;
var GUICustomSkin : GUISkin;


function OnGUI() {
	if (GUICustomSkin)
		GUI.skin = GUICustomSkin;
	// Transform matrix for (trasform, rotate, scale) - This just allows automatic scaling for everything that uses this matrix
	// Setting GUI.matrix to some other value will only affect the GUI stuff below it
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * gameOverScale);
	GUI.Label(Rect(10, 10, 160, 50), "Game Over", "MenuText");
	
}