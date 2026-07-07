import { StyleSheet } from "react-native";

import {
  Colors,
  Radius,
  Size,
  Spacing,
} from "../../theme";

export const styles = StyleSheet.create({

  container:{
    width:"100%",
    marginBottom: Spacing.lg,
  },

  label:{
    marginBottom:Spacing.sm,
  },

  inputContainer:{

    flexDirection:"row",

    alignItems:"center",

    height:Size.inputHeight,

    borderRadius:Radius.lg,

    borderWidth:1,

    borderColor:Colors.border,

    backgroundColor:Colors.surface,

    paddingHorizontal:Spacing.lg,
  },

  focused:{
    borderColor:Colors.borderFocused,
  },

  disabled:{
    opacity:0.5,
  },

  input:{
    flex:1,
    color:Colors.text,
    paddingVertical:0,
  },

  icon:{
    marginRight:Spacing.md,
  },

  rightIcon:{
    marginLeft:Spacing.md,
  },

  helper:{
    marginTop:Spacing.sm,
  },

});