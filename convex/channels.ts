import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const create= mutation({
    args:{
        workspaceId:v.id("workspaces"),
        name:v.string()
    },
    handler:async(ctx,args)=>{
        const userId= await getAuthUserId(ctx)
        if(!userId){
            throw new Error("Unauthorized")
        }

        const member= await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id",(q)=>q.eq("workspaceId",args.workspaceId).eq("userId",userId))
        .unique()

        if(!member || member.role!=="admin"){
            throw new Error("You are not authorized to create a channel")
        }

        const parsedName= args.name.replace(/\s+/g,"-").toLocaleLowerCase()
        const channelId= await ctx.db
        .insert("channels",{
            workspaceId:args.workspaceId,
            name:parsedName
        })

        return channelId
    }
})

export const get= query({
    args:{
        workspaceId:v.id("workspaces")
    },
    handler:async(ctx,args)=>{
        const userId= await getAuthUserId(ctx)
        if(!userId){
            return []
        }

        const members= await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id",(q)=>q.eq("workspaceId",args.workspaceId).eq("userId",userId))
        .unique()

        if(!members){
            return []
        }
        const channels= await ctx.db
        .query("channels")
        .withIndex("by_workspace_id",(q)=>q.eq("workspaceId",args.workspaceId))
        .collect()

        return channels
    }
    })

